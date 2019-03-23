import $ from 'cafy';
import { StringID, NumericalID } from '../../../../../misc/cafy-id';
import DriveFile from '../../../../../models/entities/drive-file';
import del from '../../../../../services/drive/delete-file';
import { publishDriveStream } from '../../../../../services/stream';
import define from '../../../define';
import { ApiError } from '../../../error';

export const meta = {
	stability: 'stable',

	desc: {
		'ja-JP': 'ドライブのファイルを削除します。',
		'en-US': 'Delete a file of drive.'
	},

	tags: ['drive'],

	requireCredential: true,

	kind: 'drive-write',

	params: {
		fileId: {
			validator: $.type(StringID),
			desc: {
				'ja-JP': '対象のファイルID',
				'en-US': 'Target file ID'
			}
		}
	},

	errors: {
		noSuchFile: {
			message: 'No such file.',
			code: 'NO_SUCH_FILE',
			id: '908939ec-e52b-4458-b395-1025195cea58'
		},

		accessDenied: {
			message: 'Access denied.',
			code: 'ACCESS_DENIED',
			id: '5eb8d909-2540-4970-90b8-dd6f86088121'
		},
	}
};

export default define(meta, async (ps, user) => {
	// Fetch file
	const file = await DriveFile
		.findOne({
			id: ps.fileId
		});

	if (file === null) {
		throw new ApiError(meta.errors.noSuchFile);
	}

	if (!user.isAdmin && !user.isModerator && !file.userId.equals(user.id)) {
		throw new ApiError(meta.errors.accessDenied);
	}

	// Delete
	await del(file);

	// Publish fileDeleted event
	publishDriveStream(user.id, 'fileDeleted', file.id);

	return;
});
