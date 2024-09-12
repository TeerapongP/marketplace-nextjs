import formidable, { IncomingForm } from 'formidable';
import { IncomingMessage } from 'http';
import fs from 'fs';
import path from 'path';

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const parseForm = (req: IncomingMessage): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      filename: (name) => `${Date.now()}_${name}`,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
};

export default parseForm;
