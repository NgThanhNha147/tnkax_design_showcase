-- Optional demo products. Run after schema.sql.
insert into public.products (category_id,title,description,image_url,views,created_at)
select c.id,v.title,v.description,v.image_url,v.views,v.created_at::timestamptz
from (values
('Ảnh bìa','Gaming Facebook Cover','Ảnh bìa phong cách gaming.','https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85',7684,'2026-08-20T08:00:00Z'),
('Ảnh bìa','Summer Campaign','Banner mùa hè.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',6886,'2026-08-19T08:00:00Z'),
('Dịch vụ','Beauty Service','Thiết kế quảng cáo dịch vụ làm đẹp.','https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85',6942,'2026-08-18T08:00:00Z'),
('Banner Shop','Coffee Promotion','Banner quảng cáo cửa hàng cà phê.','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',5644,'2026-08-17T08:00:00Z'),
('Dịch vụ','Fitness Campaign','Ấn phẩm truyền thông phòng tập.','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',6390,'2026-08-16T08:00:00Z'),
('Banner Shop','Fashion Store','Banner bộ sưu tập thời trang.','https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',6422,'2026-08-15T08:00:00Z'),
('Logo','MONO Studio','Nhận diện logo tối giản.','https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85',7102,'2026-08-12T08:00:00Z'),
('Logo','Ceramic Brand','Logo thương hiệu gốm.','https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85',6842,'2026-08-09T08:00:00Z')
) as v(category,title,description,image_url,views,created_at)
join public.categories c on c.name=v.category;
