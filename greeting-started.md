## User Stories

### Authentication

- [ ] As a user, I can register for a new account with my name, email and password
- [ ] As a user, I can sign in with my Email and password.

### Users

- [ ] As a user, I can see a list of other users so that I can send, accept or decline friend requests.
- [ ] As a user, I can get my current profile info (stay signed in after page refresh)
- [ ] As a user, I can see the profile of a specific user given a user ID
- [ ] As a user, I can update mu profile info like Avatar, Company, Job Title, Social Links and short description

### Posts

- [ ] As a user, I can see a list of posts
- [ ] As a user, I can create a new post with test content and an image.
- [ ] As a user, I can edit my posts
- [ ] As a user, I can delete my posts

### Comments

- [ ] As a user, I can see a list of comments on a post
- [ ] As a user, I can write comments on a post
- [ ] As a user, I can update my comments
- [ ] As a user, I can delete my comments

### Reactions

- [ ] As a user, I can react like or dislike to a post or a comment

### Friends

- [ ] As a user, I can send a friend request to another user who is not my friend
- [ ] As a user, I can see a list of friend requests I have received
- [ ] As a user, I can see a list of friend requests I have sent.
- [ ] As a user, I can see a list of my friends
- [ ] As a user, I can accept or decline a friend request
- [ ] As a user, I can cancel a friend request I sent
- [ ] As a user, I can unfriend a user in my friend list

## -------------------------------------------------------------------

## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Login with email and password
 * @body {email, password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route POST /users
 * @description Register new user
 * @body {name, email, password}
 * @access Public
 */
```

```javascript
/**
 * @route GET /users?page=1&limit=10
 * @description Get Users with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {name, avatarUrl, coverUrl, aboutMe, city, country, company, jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink}
 * @access Login required
 */
```

### Post APIs

```javascript
/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route POST /posts
 * @description Create a new post
 * @body {content, image}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */
```

```javascript
/**
 * @route GET /posts/:id
 * @description Get details of a single post
 * @access Login required
 */
```

```javascript
/**
 * @route GET /posts/:id/comments
 * @description Get comments of a single post
 * @access Login required
 */
```

### Comment APIs

```javascript
/**
 * @route POST /comments
 * @description Create a new comment
 * @body {content, postId}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @body {content, postId}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /comments/:id
 * @description Delete a comment
 * @access Login required
 */
```

```javascript
/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access Login required
 */
```

### Reaction APIs

```javascript
/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @body {targetType: "Post or Comment", targetId, emoji: "like" or "dislike"}
 * @access Login required
 */
```

### Friend APIs

```javascript
/**
 * @route POST /friends/requests
 * @description Send a friend request
 * @body {to: User Id}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of sent pending requests
 * @access Login required
 */
```

```javascript
/**
 * @route GET /friends
 * @description Get All Friends
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body {status: "accepted" or "declined"}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /friends/:userId
 * @description Remove a friend
 * @access Login required
 */
```
