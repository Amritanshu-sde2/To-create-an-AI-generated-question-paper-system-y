import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return [];
        return arr.map((item) => item);
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },
    dataGridEditFormatter(obj) {
        return _.transform(obj, (result, value, key) => {
            if (_.isArray(value)) {
                result[key] = _.map(value, 'id');
            } else if (_.isObject(value)) {
                result[key] = value.id;
            } else {
                result[key] = value;
            }
        });
    },

        question_papersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.title)
        },
        question_papersOneListFormatter(val) {
            if (!val) return ''
            return val.title
        },
        question_papersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.title}
            });
        },
        question_papersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.title, id: val.id}
        },

        questionsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.content)
        },
        questionsOneListFormatter(val) {
            if (!val) return ''
            return val.content
        },
        questionsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.content}
            });
        },
        questionsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.content, id: val.id}
        },

}
