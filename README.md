## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/shmhlove/Asgardium_Server/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/shmhlove/Asgardium_Server/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.

--------------------------------------------------------------------------------------------------------------------

# 아마존 접속
	1. SSH 클라이언트를 개방하십시오. (PuTTY를 사용하여 연결 방법 알아보기)
	2. 프라이빗 키 파일(MangoNight.pem)을 찾습니다. 마법사가 인스턴스를 시작하는 데 사용되는 키를 자동으로 검색합니다.
	3. SSH가 작동하려면 키가 공개적으로 표시되지 않아야 합니다. 필요할 경우 이 명령을 사용합니다.
		chmod 400 MangoNight.pem
	4. 퍼블릭 DNS을(를) 사용하여 인스턴스에 연결:
		ec2-52-79-241-224.ap-northeast-2.compute.amazonaws.com
	예:
		ssh -i "MangoNight.pem" ubuntu@ec2-52-79-241-224.ap-northeast-2.compute.amazonaws.com
		ssh -i "MangoNight.pem" ubuntu@ec2-13-124-43-70.ap-northeast-2.compute.amazonaws.com
		ssh -i "MangoNight.pem" ubuntu@13.124.43.70


	대부분의 경우 위의 사용자 이름이 맞지만, AMI 사용 지침을 숙지하여 AMI 소유자가 기본 AMI 사용자 이름을 변경하지 않도록 하십시오.
	인스턴스에 연결하는 데 도움이 필요한 경우 연결 설명서을(를) 참조하십시오.

--------------------------------------------------------------------------------------------------------------------

# 웹 접속 IP
	http://13.124.43.70:3001

--------------------------------------------------------------------------------------------------------------------

# node 프로세스 관리
	pm2 start ...js	
	pm2 list
	pm2 show 0
	pm2 stop 0

--------------------------------------------------------------------------------------------------------------------

# MongoDB 설치
	/etc/systemd/system/multi-user.target.wants/mongodb.service → /lib/systemd/system/mongodb.service.

--------------------------------------------------------------------------------------------------------------------

# 사용중인 포트 확인 및 프로세스 종료
sudo lsof -i :"포트 번호"
sudo kill -9 "프로세스 번호"

lsof -n -i4TCP:27017
lsof -n -i TCP
fuser -k 27017/tcp 
kill -9 "PID"

--------------------------------------------------------------------------------------------------------------------

# MongoDB
ubuntu@ip-172-31-24-134:~/Asgardium$ sudo service mongodb stop
ubuntu@ip-172-31-24-134:~/Asgardium$ sudo service mongodb start

ubuntu@ip-172-31-24-134:~$ mongo
> use Asgardium
> db.Users.insert({username:"test", password:"1234", admin:false})
> db.Users.find()

--------------------------------------------------------------------------------------------------------------------

# 용량 확인
df

- 사용량이 많은 순으로 정렬n
sudo du -ckx | sort -n

--------------------------------------------------------------------------------------------------------------------

#  자동실행 시스템
git 폴링 -> 변경사항체크 후 Pull 및 스크립트 실행 시스템,,, 되려나?? -> contab

--------------------------------------------------------------------------------------------------------------------
# Json 컨트롤
```javascript
object["string"] = "String";
object["name"] = "SangHo";
console.dir(object);
console.log(JSON.stringify(object));
```

```c#
JsonWriter writer = new JsonWriter(json);
writer.PrettyPrint = true; // 한줄로 JsonText를 생성하지않고 사람이 읽기 쉽게 출력
writer.IndentValue = 2; // 들여쓰기
JsonMapper.ToJson(obj, writer);

// JsonUtility.ToJson(class)
// JsonUtility.FromJson<>(jsonString)
//
// if (KeyValuePairs != null)
// {
//     var bodyDataDict = KeyValuePairs.ToDictionary(x => x.Key, x => x.Value);
//     bodyJsonString = LitJson.JsonMapper.ToJson(bodyDataDict);
// }
```
--------------------------------------------------------------------------------------------------------------------
# 예외처리
```javascript
var database = req.app.get('database');

expressApp.on('close', function()
{
	console.log("Express 서버 객체가 종료됩니다.");
	if (databaseModule.db)
    {
		databaseModule.db.close();
	}
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function ()
{
    console.log("프로세스가 종료됩니다.");
    app.close();
});

// 에러 핸들러 등록
var errorHandler = expressErrorHandler(
{
    static:
    {
        "404": "./Example/ch06/public/404.html"
    }
});
expressApp.use(expressErrorHandler.httpError(404));
expressApp.use(errorHandler);
```
--------------------------------------------------------------------------------------------------------------------
# 할일
2017-
X 라우터로 API를 추가할 수 있는 구조를 만들자.
X DB 구조를 만들자.
X 검증용 클라이언트 구현

2018-01-01
- 간단한 인증 프로세스를 만들자.
	X 서버 : 회원가입 및 로그인 처리
    X 클라 : NGUI로 로그인 클라이언트를 만들자
    X 클라 : body 데이터를 Json형태로 받아올 수 있도록 파라미터를 구성하자
	X 클라 : Json데이터를 내려주는 코드로 변경하자.
	X 클라 : 클라에서는 서버에서 내려준 Json데이터를 파싱하는 코드를 작성하자.
	X 클라 : 로그인 UI 개발
	- 클라 : UI 코드 컨트롤 구조가 필요하다.
	- 클라 : 회원가입 UI 개발
	- 클라 : Escape 문제 해결 필요
	
	- 서버/클라 : 보안을 위해 JWT를 사용해야하는데 일단 회원가입과 로그인 플로우가 완성하고, 소켓연결 테스트까지 된 이후에 인증 절차를 구현하도록하자.

- 피들러 필요하다.
    
- 소켓연결을 시도해보자.
	- 전체 유저를 대상으로 데이터 Send
	- 특정 유저를 대상으로 데이터 Send
	- 특정 그룹을 대상으로 데이터 Send
	- 주기적으로 데이터 Send

- 레파지토리 분리해야겠다.

- 외부인증 추가(google, facebook, twitter, naver, kakao, etc...)
