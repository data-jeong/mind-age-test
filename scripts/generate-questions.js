const fs = require('fs');
const path = require('path');

async function generateNewQuestions() {
  const API_KEY = process.env.OPENAI_API_KEY;
  
  if (!API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    process.exit(1);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{
          role: 'system',
          content: '당신은 재미있고 트렌디한 심리테스트 질문을 만드는 전문가입니다. MZ세대가 좋아할만한 일상적이고 공감가는 질문을 만들어주세요.'
        }, {
          role: 'user',
          content: `정신연령 테스트를 위한 10개의 질문과 각 질문당 4개의 답변을 만들어주세요. 
          
          형식:
          - 질문은 일상적이고 재미있게
          - 답변은 이모지 포함
          - 각 답변마다 점수 (10-60 사이)
          - 낮은 점수는 어린 성향, 높은 점수는 어른스러운 성향
          
          JSON 형식으로 반환:
          {
            "questions": [{
              "q": "질문",
              "a": [
                {"t": "답변 텍스트 😊", "v": 점수},
                ...
              ]
            }]
          }`
        }],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const newQuestions = JSON.parse(data.choices[0].message.content);
    
    // index.html 파일 읽기
    const indexPath = path.join(__dirname, '..', 'index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // questions 배열 부분 찾아서 교체
    const questionsStart = htmlContent.indexOf('const questions = [');
    const questionsEnd = htmlContent.indexOf('];', questionsStart) + 2;
    
    const newQuestionsString = `const questions = ${JSON.stringify(newQuestions.questions, null, 12).replace(/"/g, '"')}`;
    
    htmlContent = htmlContent.substring(0, questionsStart) + 
                  newQuestionsString + 
                  htmlContent.substring(questionsEnd);
    
    // 파일 저장
    fs.writeFileSync(indexPath, htmlContent);
    
    console.log('✅ Questions updated successfully!');
    console.log(`📅 Updated on: ${new Date().toLocaleDateString('ko-KR')}`);
    
  } catch (error) {
    console.error('❌ Error generating questions:', error);
    process.exit(1);
  }
}

generateNewQuestions();