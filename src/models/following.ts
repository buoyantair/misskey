import * as Sequelize from 'sequelize';
import { Table, Column, Model, AllowNull, Comment, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
	indexes: [{
		unique: true,
		fields: ['followerId', 'followeeId']
	}, {
		fields: ['followeeId']
	}, {
		fields: ['followerId']
	}]
})
export class Following extends Model<Following> {
	@AllowNull(false)
	@Column(Sequelize.DATE)
	public createdAt: Date;

	@Comment('The followee user ID.')
	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(Sequelize.INTEGER)
	public followeeId: number;

	@BelongsTo(() => User, {
		foreignKey: 'followeeId',
		onDelete: 'CASCADE'
	})
	public followee: User;

	@Comment('The follower user ID.')
	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(Sequelize.INTEGER)
	public followerId: number;

	@BelongsTo(() => User, {
		foreignKey: 'followerId',
		onDelete: 'CASCADE'
	})
	public follower: User;
}
