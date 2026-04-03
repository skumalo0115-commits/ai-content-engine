# Configuration Guide

## Environment Variables Setup

Before you start working on the project, ensure you have the following environment variables set up in your `.env` file:

```plaintext
env_var_name_1=value1
env_var_name_2=value2
# Add more as needed
```

## OpenRouter API Configuration

1. Register at [OpenRouter](https://openrouter.com) to get your API key.
2. Add your API key to the environment variables:

   ```plaintext
   OPENROUTER_API_KEY=your_api_key_here
   ```
3. Make sure to follow the OpenRouter API documentation for endpoints you will be using.

## Stripe Test/Production Setup

### Test Setup
1. Create a Stripe account at [Stripe](https://stripe.com).
2. Obtain your test API keys from the Stripe dashboard.
3. Add them to your environment variables:

   ```plaintext
   STRIPE_TEST_KEY=your_test_key_here
   ```

### Production Setup
1. In the same Stripe dashboard, find your live API keys.
2. Add them to the environment variables:

   ```plaintext
   STRIPE_LIVE_KEY=your_live_key_here
   ```

## Firebase Authentication Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add the Firebase configuration to your `.env` file:

   ```plaintext
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   FIREBASE_PROJECT_ID=your_project_id_here
   ```
3. Make sure the necessary authentication methods are enabled in Firebase.

## Verification Checklist

- [ ] Check environment variables are correctly set.
- [ ] Test API connections for OpenRouter and Stripe.
- [ ] Ensure Firebase authentication is functional.

## Troubleshooting

### Common Issues
- **API Key Errors:** Check if your API keys are correct and non-empty.
- **Network Issues:** Ensure your internet connection is stable.
- **Firebase Authentication:** Confirm that the authentication methods are enabled and correctly set up in Firebase.

### Additional Resources
- [OpenRouter API Documentation](https://openrouter.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Firebase Documentation](https://firebase.google.com/docs)

---
### Date Created: 2026-04-03 22:16:16 UTC
