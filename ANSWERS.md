<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
Clients sends the credential once. Server verifies it once and a "session" is created. During that session, cookies are sent back and forth and the server verifies the cookie.

Most importantly, sessions require state (so the user has to hit the same server) vs tokens doesn't require state; 
2. What does bcrypt do to help us store passwords in a secure manner. 

bcrypt hashes the password Math.pow(2, n), where the developer gets to choose the n (n should be 14 or greater). This hashing process converts and lengthens the password.

3. What does bcrypt do to slow down attackers?

1) Longer passwords take longer to decode (26 letters in the lowercase English English alphabet a-z, 26 letters in the uppercase alphabet A-Z, 10 digits 0-9, 33 symbols (according to https://www.grc.com/haystack.htm, but with emojis and other symbols it could be significantly higher))

2) Reverse engineering the hashing 14 times takes significanly longer than reverse engineering a password that was converted once no matter what method is used.

4. What are the three parts of the JSON Web Token?
1)  payload: an object with the user's necessary information (e.g., user.id, user.username, etc.)
2)  secret: the code stored outside of the application that users have access to.
3)  options: ways to limit the token (e.g., invalidating a toke after 1hr using expiresIn).
