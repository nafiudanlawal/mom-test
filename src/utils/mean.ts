export function mean(values: Array<number>) {
	if(values.length == 0){
		return undefined;
	}
	return values.reduce(function (previousValue, currentValue) {
		return previousValue + currentValue
	}) / values.length
};