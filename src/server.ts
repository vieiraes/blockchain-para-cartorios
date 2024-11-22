import express from 'express';
import blockchainRoutes from './routes/blockchain.routes';
import issuerRoutes from './routes/issuer.routes';


const app = express();
const PORT = process.env.PORT || 3434;

app.use(express.json());
app.use('/blockchain', blockchainRoutes);
app.use('/issuers', issuerRoutes);


app.listen(PORT, () => {
    console.log(`Blockchain server running on port ${PORT}`);
});

export default app;