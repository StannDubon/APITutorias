export const validate = (scheme) => {
    return (req, res, next) => {
        const result = scheme.validate(req.body);

        if (result.error) {
            next(result.error);
        } else {
            next();
        }
    };
};
