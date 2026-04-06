import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value.replace(/\\n/g, "\n");
    }
  }
}

function loadLocalEnv() {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, ".env.local"));
  loadEnvFile(path.join(cwd, ".env"));
}

function getArg(name) {
  return process.argv.find((entry) => entry === name || entry.startsWith(`${name}=`)) || null;
}

function getFlagValue(name) {
  const match = getArg(name);

  if (!match) {
    return null;
  }

  const separatorIndex = match.indexOf("=");
  return separatorIndex === -1 ? null : match.slice(separatorIndex + 1);
}

function hasFlag(name) {
  return Boolean(getArg(name));
}

loadLocalEnv();

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.");
  process.exit(1);
}

const app = getApps()[0]
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

const db = getFirestore(app);
const dryRun = !hasFlag("--apply");
const targetUid = getFlagValue("--uid");

async function main() {
  const accountsCollection = db.collection("accounts");
  const docs = targetUid
    ? [await accountsCollection.doc(targetUid).get()].filter((doc) => doc.exists)
    : (await accountsCollection.get()).docs;

  if (docs.length === 0) {
    console.log("No matching accounts found.");
    return;
  }

  const refsToReset = docs.filter((doc) => {
    const data = doc.data() || {};
    return data.plan !== "free" || data.subscription !== null;
  });

  console.log(
    JSON.stringify(
      {
        dryRun,
        target: targetUid || "all",
        scanned: docs.length,
        accountsNeedingReset: refsToReset.length,
      },
      null,
      2,
    ),
  );

  if (dryRun || refsToReset.length === 0) {
    return;
  }

  let batch = db.batch();
  let operationCount = 0;

  for (const ref of refsToReset) {
    batch.set(
      ref.ref,
      {
        plan: "free",
        subscription: null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
    operationCount += 1;

    if (operationCount % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (operationCount % 400 !== 0) {
    await batch.commit();
  }

  console.log(`Reset ${operationCount} account record(s) to free mode.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Account reset failed.");
  process.exit(1);
});
