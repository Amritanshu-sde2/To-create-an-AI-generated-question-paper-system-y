
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Question_papersDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const question_papers = await db.question_papers.create(
            {
                id: data.id || undefined,

        title: data.title
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

        submission_date: data.submission_date
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return question_papers;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const question_papersData = data.map((item, index) => ({
                id: item.id || undefined,

                title: item.title
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

                submission_date: item.submission_date
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const question_papers = await db.question_papers.bulkCreate(question_papersData, { transaction });

        return question_papers;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const question_papers = await db.question_papers.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.title !== undefined) updatePayload.title = data.title;

        if (data.status !== undefined) updatePayload.status = data.status;

        if (data.submission_date !== undefined) updatePayload.submission_date = data.submission_date;

        updatePayload.updatedById = currentUser.id;

        await question_papers.update(updatePayload, {transaction});

        return question_papers;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const question_papers = await db.question_papers.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of question_papers) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of question_papers) {
                await record.destroy({transaction});
            }
        });

        return question_papers;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const question_papers = await db.question_papers.findByPk(id, options);

        await question_papers.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await question_papers.destroy({
            transaction
        });

        return question_papers;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const question_papers = await db.question_papers.findOne(
            { where },
            { transaction },
        );

        if (!question_papers) {
            return question_papers;
        }

        const output = question_papers.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.title) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'question_papers',
                            'title',
                            filter.title,
                        ),
                    };
                }

            if (filter.submission_dateRange) {
                const [start, end] = filter.submission_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    submission_date: {
                    ...where.submission_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    submission_date: {
                    ...where.submission_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.question_papers.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'question_papers',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.question_papers.findAll({
            attributes: [ 'id', 'title' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['title', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.title,
        }));
    }

};

