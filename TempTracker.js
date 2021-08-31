class TempTracker {
    constructor(database) {
        this.db = database;
    }
    add(temp) {
        this.db.push(temp);
        return this.db;
    }
    getMinTemp() {
        const min = Math.min(...this.db);
        return min;
    }
    getMaxTemp() {
        const max = Math.max(...this.db);
        return max
    }
    getAvgTemp() {
        return this.db.reduce((elem, acc) => (acc + elem), 0) / this.db.length ;
    }
}

module.exports = TempTracker