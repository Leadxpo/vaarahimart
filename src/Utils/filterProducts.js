
export const searchProduct = (products, search) => {
    // search products login
    return products.filter(product => {
        if (search === "") {
            return product
        } else {
            return product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase())
        }
    })

}