
export const searchCategory = (categorys, search) => {
    // search categorys login
    return categorys.filter(category => {
        if (search === "") {
            return category
        } else {
            return category.name.toLowerCase().includes(search.toLowerCase())
        }
    })

}