# item_simulator
##### (개인 과제) 아이템 시뮬레이터
[AWS 링크]() <br/>
[Tistory](https://dydgustmdfl1231.tistory.com/)

### 과제 목표
1. Express.js의 기본적인 사용법 및 CRUD 기반의 REST API 설계 방법 숙지
2. NoSQL의 한 종류인 MongoDB를 mongoose를 통해 사용하는 법에 대해서 학습
3. RDBMS의 한 종류인 MySQL를 prisma를 통해 사용하는 법에 대해서 학습
4. Node.js를 이용해서 게임 아이템 제작 시뮬레이션 서비스 백엔드 서버를 구현
5. AWS EC2에 Express.js를 이용한 웹 서비스를 배포
6. 즉, 프로젝트에 요구 사항을 토대로 API 리스트를 작성하고, 백엔드 서버를 설계할 수 있다.

### API 명세서
API 목록 <br/>
![image](https://github.com/user-attachments/assets/0f7f2432-01de-4184-8da1-c5bbda752660)

API 상세 정보 
[(https://www.notion.so/API-90fb99e500e344858dbd0648b0c217bb)](https://www.notion.so/API-90fb99e500e344858dbd0648b0c217bb?pvs=4)

### ERD (aquerytool)
ERD를 aquerytool로 작성하던 도중 Table이 최대 5개 까지만 무료인 것을 알게 되어 일단 요약본으로 작성 하였습니다.
![image](https://github.com/user-attachments/assets/13ac0a81-168f-4a87-acee-7b75372ac995)


### 필수 제출 질문
1. Github 링크 (Public)
2. 도전 기능 구현 리스트
3. 질문과 답변 (README.md 파일에 추가)
    1. **암호화 방식**
        - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
            (Hash는 임의의 길이의 데이터를 고정된 길이의 데이터로 반환 시켜주는 함수이고 입력값의 길이가 달라도 출력값은 언제나 고정된 길이로 반환합니다.
             또한, 동일한 값이 입력되면 언제나 동일한 출력값을 보장해줍니다.
             Hash의 주된 용도로는 해시 테이블 자료구조에 사용되어, 빠른 데이터 검색을 위해 사용되고 암호학에서 사용되고 데이터의 무결성을 확인해 주는데 사용됩니다.
             여기서 암호학 해시 함수가 가져야 하는 특성 중 단방향 암호화가 있습니다.
             단방향 암호화라는 것은 Hash하는 것의 원본 데이터를 뭉갠다 라는 표현을 쓰고 절대 복호화가 불가능하여야 하며 Hash값을 가지고 원본값으로 연산할 수 없어야합니다.
             따라서 Hash는 단방향 암호화입니다.)
        - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
            (Hash함수의 특성인 단방향 암호화로 인해 데이터를 해싱했을 때 암호화된 값을 다시 복호화 할 수 없어 보안에 뛰어납니다. (하지만 똑같은 값을 주어졌을 때 똑같은 해싱 값으로 나오기 때문에 주의해야한다.))
    2. **인증 방식**
        - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
            (Access Token이 노출되면 실제로는 원래 유저가 아니지만 해당 유저의 권한을 가지고 할 수 있는 모든 것을 마음대로 사용할 수 있어 위험하다.)
        - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
            (이러한 보안에 대한 문제를 위해 Access Token의 유효기간을 짧게 설정하여 사용자가 자주 인증하게해주거나, Refresh Token을 만들어 DB에 저장하고, Access Token이 만료되면 Refresh Token을 통해 새로운 Access Token을 생성해주는 방법이 있다.)
    3. **인증과 인가**
        - 인증과 인가가 무엇인지 각각 설명해 주세요.
            (인증은 사용자의 신원을 검증하는 것이고, 인가는 인증된 사용자가 어떠한 자원에 접근할 수 있는지 확인하는 것이다.)
        - 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
            (인증이 필요없는 회원가입은 아직 사용자의 신원을 검증할 필요가 없기 때문에 인증이 필요하지 않고 과제에서 구현한 UserMiddleware는 사용자의 쿠키를 검증하는 단계이기 때문에 인증에 해당합니다.)
        - 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
            (관리자가 아닌 누군가 사기 아이템을 생성하고 초보자의 아이템이 최상위 아이템이 되면 게임 경제가 망가지기 때문입니다.)
    4. **Http Status Code**
        - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
            (200: 요청이 성공했다는 의미입니다. (GET, HEAD, PUT, TRACE)
             201: 요청이 성공했고, 그 결과 새로운 리소스가 생성되었습니다. (POST, PUT)
             400: Bad Request 서버가 클라이언트 오류로 인식되는 상황(ex: 잘못된 요청 구문, 잘못된 요청 메시지 프레이밍 또는 사기성 요청 라우팅)으로 인해 요청을 처리할 수 없거나 처리하지 않습니다.
             401: Unauthorized HTTP 표준은 "인증되지 않음"을 명시하지만, 의미적으로 이 응답은 "인증되지 않음"을 의미합니다. 즉, 클라이언트는 요청된 응답을 받으려면 자신을 인증해야합니다.
             404: Not Fount 서버가 요청한 리소스를 찾을 수 없습니다. 브라우저에서 이는 URL이 인식되지 않음을 의미합니다.
             409: Conflict 이 응답은 요청이 서버의 현재 상태와 충돌할 때 전송됩니다.
             500: Internal Server Error 서버에서 어떻게 처리해야 할지 모르는 상황이 발생했습니다.)   
    5. **게임 경제**
        - 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.
            - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?
             (항상 문제점은 보안에 있습니다. 캐릭터의 보안이 뚫려 내 캐릭터를 마음대로 조종이 가능 할 때 money는 결국 재화에 대한 데이터이기에 게임에서 굉장히 민감한 자원입니다.
              해당 자원이 캐릭터 정보와 함께 있으면 캐릭터 정보가 뚫릴 댸 재화의 양을 마음대로 늘리거나 줄일 수 있습니다.)
            - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
             (즉, 보안성을 늘리는게 핵심이고 당장에 생각할 수 있는 것은 서버에서 클라이언트에 직접 전송하게 될 캐릭터 정보에 넣는 것 보다는 데이터베이스에 직접 들어갈 재화 리소스를 따로 관리를 하여
              보안성을 늘려줘야 할 것 같습니다. 다른 DB에 넣는 방식으로 하여 캐릭터 정보 와 재화 관리는 따로 해주면 더욱 좋을 것 같습니다.)
        - 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
             (아이템 가격을 자기 마음대로 구매할 수 있기 때문에 예를 들어 아이템 상점에서 0원에 산 무기가 판매할 때 10000이라고 하면 돈 복사가 되기 떄문에 게임 경제가 망가집니다.
              또한, 가격을 구매할때 1000원 짜리를 10000원으로 구매하게 된다면 원래 10개를 구매할 생각이었지만 1개를 구매하게 되어 서버 롤백을 원하는 경우가 많아질 것 같습니다.
              경매장에서는 문제가 없지만 인간이라면 언제든 실수를 할 수 있기 때문에 1000만원짜리를 100만원에 올리는 실수를 방지하기 위해 경매장에 다른 유저들에게 실제로 보이는 시간 까지 시간 차이를 두어
              아이템 가격을 다시 체크하고 잘못 입력한 경우 다시 수거할 수 있는 물리적인 시간을 주는 것도 괜찮은 것 같습니다. <- 와우가 그렇습니다.)
4. 어려웠던 점
   Joi를 쓰는법이 가장 어려웠습니다. Joi가 사용자가 입력한 데이터가 유효한지 검사하는 유효성 검사 라이브러리인 것을 알고 이때 주어진 규칙
   (아이디는 몇자 이상, 글자는 몇자 이상, 이건 숫자다 등등)을 통과하는 값들만 입력되도록 제한 할 수 있습니다.
   여기서 왜 어려웠나? 저는 이 Joi를 이용한 규칙을 각각 다 나눴습니다. 제가 한 프로젝트를 예시로 itemCode는 숫자고 최소 1000이상의 수 이고 itemName은 문자열이면서 1-30자이다.
   이렇게 모든 request body에서 받아올 수 있는 가능성이 한 번이라도 있다면 다 따로따로 적어줬습니다.
   에러가 처음 생기기 시작한 부분인 아이템 생성 부분에서 이 유효성 검사를 4번을 진행하게 되었습니다. 이때 규칙 뒤에다가 unknown(true) 옵션을 입력하지 않으면 여러개의 request가 왔을 때
   그다음 검사로 넘어가지지 않았고 한번에 관리를 할 수 있게 적고 뒤에다가 unknown(true)옵션을 적어서
   여기에 request되지 않은 부분을 따로 관리했으면 더욱 하드 코딩하는 양이 줄어들 수 있었는데 또한, 다른 곳에서 유효성 검사를 할때 3-4개 이렇게 적어야하는걸 1개로 줄일 수도 있기
   때문에 관리적인 측면에다가 여러번 컴퓨터가 코드를 읽을 때 시간 단축또한 할 수 있을 것 같다는 생각이 생겨 고치려고
   하였지만 시간상의 문제로 일단 진행을 계속하게 되었습니다.
   원래 처음에 schema를 여러개를 작성해서 db를 여러개로 관리를 하여 user데이터베이스 shop데이터베이스 재화데이터베이스 등등으로 나누려고 하였는데 관리하는 법을 모르고
   한번 작성한 schema모델을 db push를 했을 경우 데이터를 온전히 보존하면서 모델에 새로운 모델을 추가하는 법(없다고 합니다.)을
   몰랐기 때문에 원래 처음 생각한 구조를 다시 간단하게 바꿔야해 프로젝트를 갈아 엎었습니다.
   인벤토리에 아이템을 추가할 때 개념을 인벤토리가 아닌 Slot으로 잡았다는 것을 제가 작성한 Schema를 볼 때는 몰랐고 db push를 하고 작성을 하던 도중 깨달았습니다.
   만약 inventory는 1개 그리고 그 하위에 slot의 숫자를 정해서 그 slot을 미리 만들어 놓고 비어있느 슬롯에 아이템을 추가 또는 슬롯
   검색을 통해서 해당 아이템이 있는지 없는지를 할 수 있었다면 더욱 게임같았을 탠데 이부분을 못한것에 대한 아쉬움이 있습니다.
   마지막으로, 캐릭터, 아이템코드로 아이템 조회 등등 조회하는 부분이 엄청 많은데 이걸 따로 빼서 에러처리까지 해결하면 코드가 깔끔해질 것 같은데 시간상의 이유로 하지 못해서 너무 아쉽습니다.
   코드를 다 작성한 후 Transaction의 데이터 일관성을 필요로 하는 부분이 보였기 때문에 마지막으로 작성을 하여 제출을 마무리할 것 같습니다.
