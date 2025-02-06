import validator from 'validator';

const sanitizeAndValidateUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Sanitize URL
  const sanitizedUrl = validator.trim(url);
  const isValidUrl = validator.isURL(sanitizedUrl, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });

  if (!isValidUrl) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  req.body.url = sanitizedUrl;
  next();
};

export default sanitizeAndValidateUrl;
