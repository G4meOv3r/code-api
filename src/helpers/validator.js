const validator = {
    value: null,
    usingNot: false,
    usingOr: false,
    total: true,
    set: {
        value: (value) => {
            validator.value = value
            validator.total = true
            return validator
        },
        total: (total) => {
            if (validator.usingNot) {
                total = !total
                validator.usingNot = false
            }
            if (validator.usingOr) {
                validator.total = validator.total || total
                validator.usingOr = false
            } else {
                validator.total = (validator.total && total)
            }
        }
    },

    is: {
        array: () => {
            validator.set.total(validator.value.isArray())
            return validator
        },

        boolean: () => {
            validator.set.total(typeof validator.value === 'boolean')
            return validator
        },

        email: () => {
            const regular = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/
            validator.set.total(!!validator.value.match(regular))
            return validator
        },

        empty: () => {
            validator.set.total(!validator.value.length)
            return validator
        },

        equals: (value) => {
            validator.set.total(validator.value === value)
            return validator
        },

        exist: () => {
            validator.set.total(validator.value !== undefined)
            return validator
        },

        int: () => {
            validator.set.total(validator.value ^ validator.value === 0)
            return validator
        },

        length: (value) => {
            validator.set.total(validator.value.length === value)
            return validator
        },

        number: () => {
            validator.set.total(typeof validator.value === 'number')
            return validator
        },

        object: () => {
            validator.set.total(typeof validator.value === 'object')
            return validator
        },

        string: () => {
            validator.set.total(typeof validator.value === 'string')
            return validator
        },

        in: {
            ranges: (ranges) => {
                let result = false
                ranges.forEach((range) => {
                    let l = true
                    let g = true
                    if (range.lt) {
                        if (validator.value >= range.lt) {
                            l = false
                        }
                    }
                    if (range.le) {
                        if (validator.value > range.lt) {
                            l = false
                        }
                    }
                    if (range.gt) {
                        if (validator.value <= range.lt) {
                            g = false
                        }
                    }
                    if (range.ge) {
                        if (validator.value < range.lt) {
                            g = false
                        }
                    }
                    if (l && g && !result) {
                        result = true
                    }
                })
                validator.set.total(result)
            },
            array: (array) => {
                validator.set.total(array.includes(validator.value))
                return validator
            }
        },

        not: new Proxy({}, {
            get: (target, value) => {
                validator.usingNot = true
                return validator.is[value]
            }
        })
    },

    or: new Proxy({}, {
        get: (target, value) => {
            validator.usingOr = true
            return validator[value]
        }
    }),

    and: new Proxy({}, {
        get: (target, value) => {
            validator.usingOr = false
            return validator[value]
        }
    }),

    check: (error) => {
        if (!validator.total) {
            validator.total = true
            throw new Error(error)
        }
        validator.total = true
        return validator
    }
}

export default validator
