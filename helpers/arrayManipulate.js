const maxIdPlusOne = arr => {
    arr.sort((m1, m2) => m2.id - m1.id)
    return arr[0].id + 1
}

const getIndexOfMember = (arr, id) => {
    return arr.findIndex(x => x.id === id)
}

module.exports = {
    maxIdPlusOne: maxIdPlusOne,
    getIndexOfMember: getIndexOfMember
}