
const { parseField } = require('./parser')

function parse(param) {
  return parseField(param)
}

function node(param) {
  const object = parse({
		source: param.source
  })
	// console.log(JSON.stringify(object, null, 2))
  let offset = parseInt(param.offset)

	// a.b.c
	let member = [];
	let findObject = function(item) {
		if (item.type === 'Identifier') {
			member.unshift(item.name)
		} else {
			member.unshift(item.property.name)
			findObject(item.object)
		}
	}

	// a{b{c}}
	let findTable = function(item) {
		let itemBody = item.body
		for (let k = 0; k < itemBody.length; ++k) {
			let field = itemBody[k]
			let expression = field.expression
			if (expression && expression.type === 'JQLForeignKeyExpression') {
				let table = expression.table
				if (table.start <= offset && offset <= table.end) {
					return {
						type: 'Table',
						member,
						data: table
					}
				} else {
					member.push(table.name)
					findTable(expression.fields)
				}
			} else if (expression && expression.type === 'Identifier') {
				return {
					type: 'Table',
					member,
					data: expression
				}
			} else {
				return {
					type: 'Table',
					member
				}
			}
		}
	}

	let travser = function(item) {
		let itemStart = item.start
		let itemEnd = item.end
		let itemType= item.type
		if (itemStart <= offset && offset <= itemEnd) {
			if (itemType === 'MemberExpression') {
				if (item.property.start <= offset && offset <= item.property.end) {
					findObject(item.object)
					return {
						type: 'Table',
						data: item.property,
						member
					}
				} else {
					let object = item.object
					return travser(object)
				}
			} else if (itemType === 'JQLForeignKeyExpression') {
				if (item.fields.start <= offset && offset <= item.fields.end) {
					member.push(item.table.name)
					return findTable(item.fields)
				} else if (item.table.start <= offset && offset <= item.table.end) {
					return {
						type: 'Table',
						data: item.table,
						member
					}
				} else if (item.alias && item.alias.start <= offset && offset <= item.alias.end) {
					return {
						type: 'Alias',
						data: item.alias
					}
				}
			} else if (itemType === 'Identifier') {
				return {
					type: 'Identifier',
					data: item // 提示表名
				}
			} else {
				return {
					type: 'Other'
				}
			}
		}
	}

  if (object.hasOwnProperty('body')) {
    let body = object.body
    for (let i = 0; i < body.length; ++i) {
      let item = body[i]

      let expression = item.expression
      if (expression instanceof Object) {
        if (expression.type === 'SequenceExpression') {
					expression = expression.expressions
					for (let j = 0; j < expression.length; ++j) {
						let element = expression[j]
						let itemStart = element.start
						let itemEnd = element.end
						if (itemStart <= offset && offset <= itemEnd) {
							return travser(element)
						}
					}
				} else if (expression.type === 'MemberExpression') {
					return travser(expression)
				} else if (expression.type === 'JQLAsExpression') {
					let { field, alias } = expression
					if (alias.start <= offset && offset <= alias.end) {
						return {
							type: 'Alias', // 不提示
							data: alias
						}
					} else if (field.start <= offset && offset <= field.end) {
						if (field.type === 'MemberExpression') {
							return travser(field)
						} else {
							return {
								type: 'Other'
							}
						}
					} else {
						return {
							type: 'Other'
						}
					}
				} else if (expression.type === 'JQLForeignKeyExpression') {
					return travser(expression)
				} else if (expression.type === 'CallExpression') {
					let {callee, arguments} = expression
					if (callee.start <= offset && offset <= callee.end) {
						return {
							type: 'Other'
						}
					} else {
						for (let x = 0; x < arguments.length; ++x) {
							let arg = arguments[x]
							if (arg.start <= offset && offset <= arg.end) {
								return {
									type: 'Args',
									data: arg
								}
							}
						}
					}
				}
      }
    }
  }

  return {
    type: 'Other' // 提示表名 和 函数集合
  }
}

function alias(param) {
	let aliases = []
	
	const object = parse({
		source: param.source
  })

  if (object.hasOwnProperty('body')) {
    let body = object.body
    for (let i = 0; i < body.length; ++i) {
      let item = body[i]

      let expression = item.expression
      if (expression instanceof Object) {
				if (expression.type === 'JQLAsExpression') {
					let { field, alias } = expression
					if (alias.start <= offset && offset <= alias.end) {
						aliases.push(alias.name)
					}
				} else if (expression.type === 'Identifier') {
					if (expression.start <= offset && offset <= expression.end) {
						aliases.push(expression.name)
					}
				}
			}
		}
	}

	return aliases
}

module.exports = {
  parse,
  node,
  alias
}