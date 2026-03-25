const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/build', (req, res) => {
    try {
        const { html = '', css = '', js = '', framework = 'vanilla' } = req.body;

        let compiledPayload = '';

        if (framework === 'react') {
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
    <div id="root"></div>
    <script type="text/babel">
        try {
            ${js}
        } catch (err) {
            document.body.innerHTML = '<pre style="color:red; padding: 20px;">Runtime Error: ' + err.message + '</pre>';
        }
    </script>
</body>
</html>`;
        } else {
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

        res.status(200).json({ success: true, previewHtml: compiledPayload });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/health', (req, res) => res.send('Engine Alive'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Preview Engine is live on port ' + PORT);
});
