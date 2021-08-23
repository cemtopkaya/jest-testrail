describe('SUITE 0', function () {
    // it('it 0_1', () => {
    //     expect(true).toBe(true)
    //     // expect('ali').toBe('veli')
    // });
    
    describe('SUITE 0_1', function () { // section
        it('it 0_1_1', () => { // case/step
            expect(true).toBe(true)
        });
        it('it 0_1_2', () => {
            expect(true).toBe(true)
        });
    });
})

describe('SUITE 1', function () {
    it('it 1', () => {
        expect(true).toBe(true)
        // expect('ali').toBe('veli')
    });

    /* Step'li hal
     *   describe > case
     *   it > step
     *
     * Stepsiz hal
     *   describe > section
     *   it > case 
     */
    describe('SUITE 2', function () { // section
        it('it 2_1', () => { // case/step
            expect(true).toBe(true)
        });
        it('it 2_2', () => {
            expect(true).toBe(true)
        });


        describe('SUITE 4', function () {
            it('it 4', () => { });
        });

        describe('SUITE 5', function () {
            it('it 5', () => { });
        });

        describe('SUITE 6', function () {
            it('it 6', () => { });

            describe('SUITE 7', function () {
                it('it 7_1', () => { });
                it('it 7_2', () => { });
            });
        });

    });

    describe('SUITE 3', function () {
        it('it 3', () => { });
    });

});