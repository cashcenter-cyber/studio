# ✅ Cash-Center.fun - Launch Checklist

Congratulations! The codebase for **Cash-Center.fun** has been generated. Follow these steps to get your site up and running locally.

### 1. Install Dependencies

First, open your terminal in the project root directory and install all the necessary packages.

```bash
npm install
```

### 2. Configure Firebase

Your application relies on Firebase for authentication and database services.

1.  **Create a Firebase Project:** If you haven't already, go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Set up Authentication:** In your Firebase project, go to the **Authentication** section, click **Get Started**, and enable the **Email/Password** and **Google** sign-in methods.
3.  **Set up Firestore:** Go to the **Firestore Database** section, click **Create database**, and start in **production mode**.
4.  **Get Firebase Config Keys:**
    *   In your Firebase project settings (click the ⚙️ icon), scroll down to "Your apps".
    *   Create a new **Web app** (or use an existing one).
    *   Find the `firebaseConfig` object. It contains your client-side API keys.
5.  **Generate a Service Account Key (for Admin access):**
    *   In your Firebase project settings, go to the **Service accounts** tab.
    *   Click **Generate new private key**. A JSON file will be downloaded.
    *   **Important:** Keep this file secure and do not commit it to version control.

### 3. Set Up Environment Variables

1.  Rename the `.env.local.example` file to `.env.local`.
2.  Open `.env.local` and fill in the values:

    *   **Client Keys:** Copy the values from your `firebaseConfig` object into the `NEXT_PUBLIC_FIREBASE_*` variables.
    *   **Admin Key:** You need to encode your service account JSON file into Base64.
        *   **On macOS/Linux:** `base64 -w 0 path/to/your/serviceAccountKey.json`
        *   **On Windows (PowerShell):** `[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\your\serviceAccountKey.json"))`
        *   Paste the resulting long string into the `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` variable.
    *   **Webhook Secret:** Create a strong, random secret for `OFFERWALL_PARTNER_SECRET`.

### 4. Run the Development Server

Now you're ready to start the app!

```bash
npm run dev
```

Your site should now be running at [http://localhost:9002](http://localhost:9002).

### 5. Create Your First Admin User

To access the admin-only pages, you need to assign the 'admin' role to a user.

1.  **Sign up for an account** on your local website using the regular sign-up form.
2.  Open a **new terminal window** in the project root.
3.  Run the `set-admin` script, replacing `<your-email>` with the email you just registered. You'll need `ts-node` and `dotenv-cli` which can be installed via `npm install -D ts-node dotenv-cli`.

    ```bash
    npx ts-node --require dotenv/config src/scripts/set-admin.ts <your-email>
    ```

4.  You will see a success message. Log out and log back in on the website. You should now see the "Admin" section in your dashboard sidebar.

---

You are all set! Enjoy your new Get-Paid-To website.
