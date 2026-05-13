/**
 * Mock Credentials for Testing Without Database
 * Store mock users, authors, and admins for authentication testing
 */

export const mockUsers = {
    users: [
        {
            _id: "user-001",
            firstName: "John",
            lastName: "Doe",
            email: "user@example.com",
            password: "$2a$12$KIXxPfxr.K2yf1sTLa.0uOz8Ib4xLBWmjD8DQJfWE8N.BZyKxF4Nm", // Password: user123
            profileImageUrl: "https://via.placeholder.com/150?text=User",
            role: "USER",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: "user-002",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.user@example.com",
            password: "$2a$12$KIXxPfxr.K2yf1sTLa.0uOz8Ib4xLBWmjD8DQJfWE8N.BZyKxF4Nm", // Password: user123
            profileImageUrl: "https://via.placeholder.com/150?text=Jane",
            role: "USER",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    authors: [
        {
            _id: "author-001",
            firstName: "Alice",
            lastName: "Johnson",
            email: "author@example.com",
            password: "$2a$12$KIXxPfxr.K2yf1sTLa.0uOz8Ib4xLBWmjD8DQJfWE8N.BZyKxF4Nm", // Password: author123
            profileImageUrl: "https://via.placeholder.com/150?text=Author1",
            role: "AUTHOR",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: "author-002",
            firstName: "Bob",
            lastName: "Wilson",
            email: "bob.author@example.com",
            password: "$2a$12$KIXxPfxr.K2yf1sTLa.0uOz8Ib4xLBWmjD8DQJfWE8N.BZyKxF4Nm", // Password: author123
            profileImageUrl: "https://via.placeholder.com/150?text=Author2",
            role: "AUTHOR",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    admins: [
        {
            _id: "admin-001",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            password: "$2a$12$KIXxPfxr.K2yf1sTLa.0uOz8Ib4xLBWmjD8DQJfWE8N.BZyKxF4Nm", // Password: admin123
            profileImageUrl: "https://via.placeholder.com/150?text=Admin",
            role: "ADMIN",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
};

/**
 * Get all mock users across roles
 */
export const getAllMockUsers = () => {
    return [...mockUsers.users, ...mockUsers.authors, ...mockUsers.admins];
};

/**
 * Find user by email
 */
export const findMockUserByEmail = (email) => {
    return getAllMockUsers().find(user => user.email === email);
};

/**
 * Find user by ID
 */
export const findMockUserById = (id) => {
    return getAllMockUsers().find(user => user._id === id);
};

/**
 * Credentials Reference:
 * 
 * USERS:
 *   - Email: user@example.com | Password: user123
 *   - Email: jane.user@example.com | Password: user123
 * 
 * AUTHORS:
 *   - Email: author@example.com | Password: author123
 *   - Email: bob.author@example.com | Password: author123
 * 
 * ADMINS:
 *   - Email: admin@example.com | Password: admin123
 */
