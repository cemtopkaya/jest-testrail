describe('AUSF >', function () {

    it('it 1_1 :', function () {
        a = true;
        expect(a).toBe(true);
    });

    describe('General >', function () {

        var a;
        it('----Number of connection should be changed', function () {
            a = true;
            expect(a).toBe(true);
            expect("ahmet").toEqual("ahmet1", "hede çıktı");
        });

        it('it 2_2 :', function () {
            a = true;
            expect(a).toBe(true);
            expect("ahmet").toBe("ahmet");
        });

        it('it 2_3 withcontextli:', function () {
            a = true;
            expect(a).withContext('modal açılmış olmalı').toBe(true);
            expect("ahmet").withContext('değer değiştirilmeli').toEqual("ahmet1");
            expect(a).toBeNull()
        });

        describe('describe 4 >', function () {

            var a;
            it('it 4_1 :', function () {
                a = true;
                expect(a).toBe(true);
                expect("ahmet").toBe("ahmet1");
            });
        });

        it('it 1_2 :', function () {
            a = true;
            expect(a).toBe(true);
        });

    });

    describe('UDM', function () {

        it('UDM1 Seçilir', function () {
            // GIVEN 
            var cssGeneralExpected = 'tab selected'

            // WHEN

            // THEN
            var cssGeneralActual = 'tab selected'
            expect(cssGeneralActual).toBe(cssGeneralExpected)
        })

        it('Açılan sayfanın adresi network/UDM olarak biter', function () {
            // GIVEN 
            var currentUrl = 'http://localhost:4200/network/UDM'

            // WHEN

            // THEN
            var endsWith = 'network/UDM'
            expect(currentUrl.endsWith(endsWith))
        })

        describe('General', function () {
            it('General sekmesine tıklanır', function () {
                // GIVEN 
                var cssGeneralExpected = 'tab selected'

                // WHEN

                // THEN
                var cssGeneralActual = 'tab selected'
                expect(cssGeneralActual).toBe(cssGeneralExpected)
            })

            describe('Connection Timeout', function () {
                it('0 dan küçük değer girildiğinde hata verir', function () {
                    expect(true).toBe(true)
                })

                it('0 dan küçük değer girildiğinde input elemanın çevresi kırmızı olur', function () {
                    expect(true).toBe(true)
                })

                it('0 dan küçük değer girildiğinde hata verir', function () {
                    expect(true, '0 dan küçük değer girildiğinde hata verir').toBe(true)
                    expect(true, '0 dan küçük değer girildiğinde input elemanın çevresi kırmızı olur').toBe(true)
                })

                it('65535 den büyük değer girildiğinde hata verir', function () {
                    expect(true).toBe(false)
                })

                it('başarıyla değiştirilir', function () {
                    expect(true)
                })
            });
            //if(pass){it(desc)->al}else{withContext(desc)->al}

            describe('Connection Pool Size', function () {
                it('0 dan küçük değer girildiğinde hata verir', function () {
                    expect(true).toBe(true)
                })

                it('2000 den büyük değer girildiğinde hata verir', function () {
                    expect(true).toBe(true)
                })

                it('başarıyla değiştirilir', function () {
                    expect(true)
                })
            });
        });
    });
});