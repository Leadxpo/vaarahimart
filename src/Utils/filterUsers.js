
export const filterUsers = (users) => {
    const usersByYear = users.map((user) => {
        // const year = new Date(user.created_at).getFullYear()
        if (new Date(user.created_at).getFullYear() === 2022) {
            return user
        } else {
            return;
        }
    })

    const months = ["Jaunary", "Fabruary", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    const mapUserByMonth = usersByYear.map(user => {
        return { ...user, created_at: months[new Date(user.created_at).getMonth()] }
    })
    const monthlyUsers = mapUserByMonth.reduce((acc, cur) => {
         acc[cur.created_at] = (acc[cur.created_at] || 0) + 1
         return acc
      }, {})

    return Object.entries(monthlyUsers)
    // return usersByYear
}