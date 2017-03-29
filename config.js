var dimension_x = 5;
//Yatay eksende haritanın büyüklüğünü belirtir. Her zaman tek sayı çıkması için bu sayının 2 katının 1 fazlası kare sayısı olarak kullanılır.

var dimension_y = 5;
//Dikey eksende haritanın büyüklüğünü belirtir. Her zaman tek sayı çıkması için bu sayının 2 katının 1 fazlası kare sayısı olarak kullanılır.

var moveSpeed = 5;
//Oyuncuların hızını belirtir. Tavsiye edilen aralık 3-5

var bombCount = 1;
//Oyun başında her oyuncunun sahip olacağı bomba sayısıdır.

var bombSize = 1;
//Oyun başında her oyuncunun sahip olduğu bombaların etrafa yayılma miktarıdır.

var bombExplodeTime = 4000;
//Bomba patlamadan önce geçmesi gereken süreyi belirtir. (ms)

var bombExplosionTime = 1000;
//Bomba patladıktan sonra alevin yanacağı süreyi belirtir. (ms)

var brick_density = 0.60;
//Oyundaki tuğla sıklığını belirtir. (0 - 1)

var cursePeriod = 20000;
//Oyuncu tarafından alınan lanetlerin ne kadar süreceğini belirtir. (ms)

var extra_bomb_density = 0.25;
//Tuğlaların arkasında oluşacak ekstra bomba yeteneğinin sıklığını belirtir. (0 - 1)

var upgrade_bomb_size_density = 0.25;
//Tuğlaların arkasında oluşacak bomba boyutu büyütme yeteneğinin sıklığını belirtir. (0 - 1)

var nonstop_dropbomb_curse_density = 0.05;
//Tuğlaların arkasında oluşacak sürekli bomba bırakma lanetinin sıklığını belirtir. (0 - 1)

var big_bombsize_curse_density = 0.05;
//Tuğlaların arkasında oluşacak bomba boyu büyütme lanetinin sıklığını belirtir. (0 - 1)

var no_dropbomb_curse_density = 0.05;
//Tuğlaların arkasında oluşacak bomba bırakamama lanetinin sıklığını belirtir. (0 - 1)

var small_bombsize_curse_density = 0.05;
//Tuğlaların arkasında oluşacak bomba boyu küçültme lanetinin sıklığını belirtir. (0 - 1)

var half_speed_curse_density = 0.05;
//Tuğlaların arkasında oluşacak hızı yarıya düşürme lanetinin sıklığını belirtir. (0 - 1)

var double_speed_curse_density = 0.05;
//Tuğlaların arkasında oluşacak hızı iki katına çıkarma lanetinin sıklığını belirtir. (0 - 1)
