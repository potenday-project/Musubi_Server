# Boilerplate_nodejs_express

### Editored by Seungho Song

- typescript 기반 Node.js express 의 환경 구축을 위한 BoilerPlate 코드입니다.
- 참고 Repository : https://github.com/wlsrn3684/express-typescript-boilerplate

### 최소 요건

- Node.js v12.22.0, v14.17.0 또는 v16 이상의 최신 버전
- Prettier, ESlint 확장 프로그램 설치 (VSCode)

## Modules Description

### Dependencies

- `bcryptjs` : 비밀번호 암호화 관련 모듈
- `cookie-parser`
- `cors` : CORS ERROR 관련 모듈
- `day.js` : 날짜 관련 모듈 (moment.js 보다 이게 더 나을 듯)
- `dotenv`
- `express`
- `jsonwebtoken` : JWT 토큰 관련 모듈
- `swagger-ui-express` : API 리소스를 시각화
- `typeorm` : typescript, javascript 전용 ORM 모듈
- `typeorm-naming-strategies` : typeorm 중 naming 관련 모듈
- `winston` : 향상된 로그 생성

### Development Dependencies

- `typescript`
- `@types/node`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint` : js, ts의 디버거 역할
- ~~`nodemon` : 개발 시 서버 환경 자동 동기화~~ -> tsc-watch로 전환
- ~~`rimraf` : 자동 rm -rf 실행~~ -> unnecessary
- `prettier` : Code Style 설정
- `ts-node` : typescript로 node.js 작업
- `tsc-watch` : typescript 버전 nodemon
