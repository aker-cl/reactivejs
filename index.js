//@ts-check

export const Reactive = {
    /**
     * Function to define a reactive variable
     * 
     * @param {String} variableName 
     * @param {any} initialValue 
     * @param {Function|null} callback 
     */
    def: (variableName, initialValue, callback = null) => {
        let variable = initialValue;

        const notifyChange = () => {
            const safeValue = Array.isArray(variable) ? [...variable] :
                            typeof variable === "object" ? { ...variable } :
                            variable;
            if (callback) callback(safeValue);
        };

        if (Array.isArray(variable)) {
            // Interceptar métodos de array que modifican su contenido
            ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "copyWithin", "toSpliced"].forEach(method => {
                const originalMethod = variable[method];
                variable[method] = function (...args) {
                    const result = originalMethod.apply(variable, args);
                    notifyChange();
                    return result;
                };
            });
        } else if (typeof variable === "object" && variable !== null) {
            // Usar Proxy para detectar cambios en propiedades de objetos
            variable = new Proxy(variable, {
                set(target, prop, value) {
                    target[prop] = value;
                    notifyChange();
                    return true;
                }
            });
        }

        Object.defineProperty(Reactive, variableName, {
            get() {
                return variable;
            },
            set(value) {
                variable = value;
                notifyChange();
                return value;
            }
        });

        // Inicializar la variable reactiva
        Reactive[variableName] = variable;
    }
};


/**
 * Function to define a reactive variable with getter and setter
 * 
 * @param {any} value 
 * @param {Function} callback 
 * @returns {Object}
 */
export const ReactiveV2 = (value, callback) => {
    let varValue = value;

    const notifyChange = () => {
        // Para los arrays, devolvemos una copia con spread [...varValue]
        // Para los objetos, devolvemos una copia con { ...varValue }
        const safeValue = Array.isArray(varValue) ? [...varValue] : 
                        typeof varValue === "object" ? { ...varValue } : 
                        varValue;
        callback(safeValue);
    };

    const wrapped = {
        get value() {
            return varValue;
        },
        set value(newValue) {
            varValue = newValue;
            notifyChange();
        }
    };

    if (Array.isArray(varValue)) {
        ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "copyWithin", "toSpliced"].forEach(method => {
            const originalMethod = varValue[method];
            varValue[method] = function (...args) {
                const result = originalMethod.apply(varValue, args);
                notifyChange();
                return result;
            };
        });
    } else if (typeof varValue === "object" && varValue !== null) {
        varValue = new Proxy(varValue, {
            set(target, prop, newValue) {
                target[prop] = newValue;
                notifyChange();
                return true;
            }
        });
    }

    return wrapped;
};