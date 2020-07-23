export default {
    formatDate(date){
        if (date) {
            var date1 = new Date(date)
            var year = date1.getFullYear()
            var month = date1.getMonth() + 1
            var day = date1.getDate()
            date1.getHours()
            return year + '-' + month + '-' + day + ' '  + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
        }
        return ''
    },
    deepClone(data){
        return JSON.parse(JSON.stringify(data))
    }
}