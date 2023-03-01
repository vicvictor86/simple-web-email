import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserMessagesTable1677556495131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'user_messages',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'message_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'sender_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'addressee_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'replying_to_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'forwarding_to_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'read',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'MessageUserConnection',
                        referencedTableName: 'messages',
                        referencedColumnNames: ['id'],
                        columnNames: ['message_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'UserSenderConnection',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['sender_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'UserAddresseeConnection',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['addressee_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user_messages');
    }

}
