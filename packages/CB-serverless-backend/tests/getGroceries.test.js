var LambdaTester = require( 'lambda-tester' );
import  { main } from '../api/groceries/getGroceries';

describe('getGroceriesLambda', function() {
	it( `Returns groceries`, function() {
		return LambdaTester(main)
			.event({
				queryStringParameters: {
					category: "eatable",
					limit: 5
				}
			})
			.expectResult( ( result ) => {
				const resultJSON = JSON.parse(result.body);
				expect(result.statusCode).toEqual(200);
				expect(resultJSON.Items.length).toBe(5);
			});
	});
	
	it( `Returns groceries by category`, function() {
		return LambdaTester(main)
			.event({})
			.expectResult( ( result ) => {
				expect(result.statusCode).toEqual(200);
				expect(result.body.length).toBeGreaterThan(1);
			});
	});
});