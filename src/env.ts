require('dotenv').config();

function environmentVariable(key: string): string {
  const value = process.env[key];
  if (value != null) {
    return value;
  }
  console.error(`Environment varialbe '${key}' is missing`);
  process.exit(1);
}

export const cfduid = environmentVariable('CFDUID');
export const tokenV2 = environmentVariable('TOKEN_V2');
export const cdnUrl = environmentVariable('CDN_URL');
export const repoPath = environmentVariable('REPO_PATH');
export const bucket = environmentVariable('AWS_BUCKET');
export const accessKeyId = environmentVariable('AWS_ACCESS_KEY_ID');
export const secretAccessKey = environmentVariable('AWS_SECRET_ACCESS_KEY');
