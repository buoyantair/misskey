import * as promiseLimit from 'promise-limit';
import DriveFile, { DriveFile } from '../models/entities/drive-file';
import del from '../services/drive/delete-file';

const limit = promiseLimit(16);

DriveFile.find({
	'userHost': {
		$ne: null
	},
	'metadata.deletedAt': { $exists: false }
}, {
	fields: {
		id: true
	}
}).then(async files => {
	console.log(`there is ${files.length} files`);

	await Promise.all(files.map(file => limit(() => job(file))));

	console.log('ALL DONE');
});

async function job(file: DriveFile): Promise<any> {
	file = await DriveFile.findOne({ _id: file.id });

	await del(file, true);

	console.log('done', file.id);
}
