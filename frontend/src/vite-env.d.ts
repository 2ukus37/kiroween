/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_POLYGON_RPC_URL: string;
  readonly VITE_CREATOR_TOKEN_ADDRESS: string;
  readonly VITE_CONTENT_NFT_ADDRESS: string;
  readonly VITE_REWARD_POOL_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
