-- real_estate_articles 샘플 데이터
insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '자이뷰 84A',
  '아파트',
  '전세',
  '10/25',
  '3억 2,000',
  '남동',
  '2025-02-19',
  '역세권, 올수리',
  '자이뷰',
  '홍길동',
  'https://example.com/1',
  true
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '자이뷰 84A'
    and tradetypename = '전세'
);

insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '수지 센트럴 59',
  '아파트',
  '매매',
  '7/20',
  '6억 5,000',
  '남서',
  '2025-02-18',
  '전망 좋은 남향',
  '수지 센트럴',
  '김영희',
  'https://example.com/2',
  true
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '수지 센트럴 59'
    and tradetypename = '매매'
);

insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '하이파크 46',
  '오피스텔',
  '월세',
  '12/18',
  '보증금 1,000 / 70',
  '동향',
  '2025-02-17',
  '풀옵션, 주차 가능',
  '하이파크',
  '이철수',
  'https://example.com/3',
  false
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '하이파크 46'
    and tradetypename = '월세'
);

insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '자이 리버 84B',
  '아파트',
  '매매',
  '3/25',
  '7억 8,000',
  '남향',
  '2025-02-16',
  '초품아, 학군 우수',
  '자이 리버',
  '박지민',
  'https://example.com/4',
  false
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '자이 리버 84B'
    and tradetypename = '매매'
);

insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '수지 포레 75',
  '아파트',
  '전세',
  '15/20',
  '2억 9,000',
  '서향',
  '2025-02-15',
  '즉시 입주 가능',
  '수지 포레',
  '최유리',
  'https://example.com/5',
  false
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '수지 포레 75'
    and tradetypename = '전세'
);

insert into public.real_estate_articles (
  articlename,
  realestatetypename,
  tradetypename,
  floorinfo,
  dealorwarrantprc,
  direction,
  articleconfirmymd,
  articlefeaturedesc,
  buildingname,
  realtorname,
  cppcarticleurl,
  "isPopular"
)
select
  '리빙스테이 33',
  '오피스텔',
  '전세',
  '5/12',
  '1억 6,000',
  '북동',
  '2025-02-14',
  '역 도보 5분',
  '리빙스테이',
  '정하늘',
  'https://example.com/6',
  true
where not exists (
  select 1
  from public.real_estate_articles
  where articlename = '리빙스테이 33'
    and tradetypename = '전세'
);
