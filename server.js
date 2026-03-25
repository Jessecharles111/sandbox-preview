const express = require('express');
const cors = require('cors');

const app = express();

// Middleware: Enable CORS for your AI builder frontend and allow large code payloads
app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.post('/api/build', (req, res) => {
    try {
        const { html = '', css = '', js = '', framework = 'vanilla' } = req.body;

        let compiledPayload = '';

        if (framework === 'react') {
            // Hydrates a React environment instantly using CDNs and Babel Standalone
            compiledPayload = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${css}</style>
                <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${html || '<div id="root"></div>'}
                <script type="text/babel" data-type="module">
                    try {
                        ${js}
                    } catch (err) {
                        document.body.innerHTML = '<pre style="color:red; padding: 20px;">Runtime Error: ' + err.message + '</pre>';
                    }
                </script>
            </body>
            </html>`;
        } else {
            // Standard Vanilla JS/HTML payload
            compiledPayload = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${css}</style>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${html}
                <script type="module">
                    try {
                        ${js}
                    } catch (err) {
                        console.error(err);
                    }
                </script>
            </body>
            </html>`;
        }

        // Return the raw HTML string
        res.status(200).json({ success: true, previewHtml: compiledPayload });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint to keep free tiers awake
app.get('/health', (req, res) => res.send('Engine is fully operational.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`🚀 Preview Engine running on port \${PORT}\`));
