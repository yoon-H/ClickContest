# 프로젝트 설명
회원가입 / 로그인 기능을 담당하는 HTTP 서버 AuthServer와 클릭 이벤트를 담당하는 TCP 서버 GameServer로 나뉩니다.

# 실행 방법

다음 명령어를 터미널에서 실행하면 서버가 작동됩니다.

``` shell
node AuthServer/app.js
node GameServer/server.js
```

# API 명세

HTTP SERVER 명세

|기능|request|response|
|:---:|:---:|:---:|
|회원가입|{ id, password, address }|{ code: 201, message: "유저가 등록되었습니다." }|
|로그인|{ id, password }|{ code: 200, data: token }|

# TCP SERVER

## 패킷 구조

|이름|크기|설명|
|:---:|:---:|:---:|
|packetLength|4byte|전체 패킷 길이|
|resonseCode|-|응답 종류 코드|
|data|-|데이터(key:value 형식)|

# 실격 처리

### HTTP 서버

DB의 유저정보에 실격 여부를 저장합니다.
로그인을 할 때 실격 여부를 불러와 실격했으면 로그인을 못하게 만듭니다.

### TCP 서버

클라이언트에서 클릭 이벤트가 발생하면 토큰을 보냅니다.

클릭 게임 중 부정행위나 10초 이상 클릭하지 않아 실격당하면 블랙리스트에 토큰을 저장하고 접속 중인 유저에서 삭제합니다.
그리고 db에 해당 유저의 실격 여부를 업데이트하고, 연결을 지웁니다.

이후 실격된 유저가 다시 참여를 신청하면 블랙리스트에서 토큰을 찾아 차단합니다.

# ERD 다이어그램

![image](https://github.com/user-attachments/assets/cd6b6e22-9391-4716-b005-b1049637e1f3)

