# Tennis Partner Node API Specifications

Backend for a tennis partner website. 

First project has been made earlier at Python Django Rest Api + Vue.
This project do the same functions as Python, but on Node.js

# Base module: 
basic controller and router for other parts. Implement DRY principle.
### Offers (offer to play tennis, or other sports, at some place, at some
time, with specific details)
- List all offers in the database
   * Pagination
   * Select specific fields in result
   * Limit number of results
   * Filter by fields
- Get single offer
- Create new offer
  * Authenticated users only
  * Field validation via Mongoose
- Update offer
  * Owner only
  * Validation on update
- Delete offer
  * Owner only


### Courts
- List all courts 
- List all courts in general
  * Pagination, filtering, etc
- Get single court
- Create new court
  * Admin / Court-admin users only
  * Only 1 court per person (admin can create more)
- Update court
  * Court admin only
- Delete court
  * Court admin only
  
### Messages
Messages has 3 fields:
1 - message itself
2 - relation to user, that is sender
3- relation to user, that is receiver
- List all messages (Admin only)
- List all messages, related to user
  * Pagination, filtering, etc
- Get a single message by id (user as sender or receiver only)
- Get all sent messages by user
- Get all received messages by user
- Create message
  * Authenticated users only
- Update message
  * author only
- Delete message
  * author only

### Users & Authentication
- at this time, Passport.js not been used (by express methods)
- Authentication will be ton using JWT/cookies
  * JWT and cookie should expire in 30 days
- User registration
  * Register as a "user" or "courtAdmin"
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords must be hashed
- User login
  * User can login with username and password
  * Plain text password will compare with stored hashed password
  * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get current user by Token
  * Route to get the currently logged in user (via token)
- Password reset (lost password)
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address
  * A put request can be made to the generated url to reset password
  * The token will expire after 10 minutes
- Update user info
  * Authenticated user only
  * Separate route to update password
- User CRUD 
  ** Admin only (still in process)
- Users can only be made admin by updating the database field manually (still in process)

## Security
- Encrypt passwords and reset tokens
- Prevent cross site scripting - XSS
- Prevent NoSQL injections
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Add headers for security (helmet)
- Use cors to make API public (for now)

## Code Related Suggestions
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data

## Documentation
- Use Postman to create documentation