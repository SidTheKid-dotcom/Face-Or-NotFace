const express = require('express');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        // Convert `message` to a string if it is a Buffer
        const messageStr = message.toString();

        // Check if the conversion was successful and proceed
        const base64Data = messageStr.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync('frame.jpg', Buffer.from(base64Data, 'base64'));

        console.log('seinding to script')

        // Run Python script to process the frame
        const pythonProcess = spawn('python', ['analyze_pose.py', 'frame.jpg']);
        

        pythonProcess.stdout.on('data', (data) => {
            console.log('answer from script: ', data.toString());
            ws.send(data.toString()); // Send results back to client
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
