/**
 * @module asyncHandler
 * @description
 * Middleware utility for wrapping asynchronous Express route handlers.
 * 
 * This function eliminates repetitive try/catch blocks in async route handlers
 * by automatically catching and handling unhandled promise rejections or errors.
 * 
 * If an error occurs during execution of the wrapped function, it logs the error
 * (including the stack trace in development) and sends a standardized JSON response.
 *
 * @example
 * const express = require('express');
 * const router = express.Router();
 * const asyncHandler = require('./utils/asyncHandler');
 *
 * router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await User.findAll();
 *     res.json({ success: true, data: users });
 * }));
 *
 * @example
 * // Example with error handling inside asyncHandler
 * router.post('/create', asyncHandler(async (req, res) => {
 *     throw new Error('Database connection failed');
 * }));
 */

/**
 * Wraps an asynchronous Express route handler or middleware function.
 *
 * @param {Function} fn - The async route handler (req, res, next) => Promise.
 * @returns {Function} Wrapped Express middleware function with built-in error handling.
 */
const asyncHandler = (fn) => {
    return async (req, res, next = () => {}) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            console.error(`❌ Error: ${err.message || err}`);
            console.error('STACK TRACE:', err?.stack);

            return res.status(500).json({
                success: false,
                message: err?.message || err?.sqlMessage || 'Internal Server Error',
                data: null,
                error: err,
                stackTrace: process.env.NODE_ENV === 'DEV' ? err.stack : null
            });
        }
    };
};

module.exports = asyncHandler;
