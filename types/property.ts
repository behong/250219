export interface Property {
    articleno?: number
    articlename: string // 아파트 이름
    realestatetypename: string // 주택 유형 (아파트, 오피스텔, 단독주택 등)
    tradetypename: string // 거래 유형(매매, 전세 등)
    floorinfo: string // 층 정보
    dealorwarrantprc: string // 거래 가격
    direction: string // 방향(동, 서, 남, 북 등)
    articleconfirmymd: string // 거래 완료 날짜
    articlefeaturedesc:string // 아파트 특징 설명
    buildingname:string // 아파트 이름(동)
    realtorname:string // 매물 담당자 이름
    cppcarticleurl:string // 아파트 사진 URL
    created_at: string // 생성 날짜
    isPopular?: boolean   // 인기 아파트 여부
}