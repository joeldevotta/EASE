# Admin account management

Admin accounts are stored in the `admin_accounts` database table. Passwords are BCrypt-hashed and are never included in API responses.

## First admin
Set the Render backend environment variables:
- `EASE_ADMIN_USERNAME`
- `EASE_ADMIN_PASSWORD` (at least 16 characters)
- `EASE_ADMIN_EMAIL` (optional)

The backend seeds this account at startup only if its username does not already exist.

## Add another admin
After deployment, use Postman or curl to send an authenticated HTTPS POST request to `/api/admin/accounts`. Authenticate with an existing admin's HTTP Basic credentials. Use JSON fields `username`, `email`, and `password`; the new password must be at least 16 characters.

Example JSON body:
```json
{
  "username": "newadmin",
  "email": "newadmin@eec.srmrmp.edu.in",
  "password": "replace-with-a-unique-16-character-or-longer-password"
}
```

A successful creation returns HTTP 201 with the account id, username, email and creation time, but no password. Duplicate usernames/emails return HTTP 409. To list accounts, send an authenticated GET request to `/api/admin/accounts`.

## Scope
- Only authenticated admins can use these endpoints.
- The current frontend demo login in `src/services/authService.ts` remains separate; this change does not connect the frontend login to backend authentication.
- There is no create-admin UI yet; use Postman or the API.
- There is no delete/revoke or password-reset endpoint yet. Changing the Render bootstrap password does not change an existing database account.
- Use HTTPS and never store real credentials in source code or the frontend.
