exports.idChecking = (req, id) => {
    if (typeof id == 'string') {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return { idError: { message: "Url or Id is wrong!" } }
        }
    } else {
        return { idError: { message: "Url or Id is wrong!" } }
    }
}