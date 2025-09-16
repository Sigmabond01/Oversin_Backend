import { randomUUID } from "crypto";

export const logger = (req, res, next) => {
    const start = Date.now();
    const requestId = randomUUID();
    res.setHeader("X-Request-Id", requestId);

    const log = (statusCode) => {
        const duration = Date.now() - start;
        console.log(JSON.stringify({
            level: statusCode >= 400 ? 'error' : 'info',
            timestamp: new Date().toISOString(),
            requestId,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            status: statusCode,
            duration: `${duration}ms`,
        }));
    };

    res.on('finish', () => log(res.statusCode));
    res.on('close', () => {
        if(!res.writableFinished) {
            log(res.statusCode);
        }
    });

    next();
};