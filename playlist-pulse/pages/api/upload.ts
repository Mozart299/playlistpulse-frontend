// import { NextApiRequest, NextApiResponse } from 'next';
// import { IncomingForm, File } from 'formidable';
// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const form = new IncomingForm();
//   form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
//   form.keepExtensions = true;

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     const file = files.file as File;
//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const newPath = path.join(form.uploadDir, file.name as string);
//     fs.renameSync(file.path as string, newPath);

//     res.status(200).json({ url: `/uploads/${file.name}` });
//   });
// }