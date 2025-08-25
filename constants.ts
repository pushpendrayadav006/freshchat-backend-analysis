const GEMINI_FRESHCHAT_ANALYSIS_PROMPT = `assign the tags to a conversation based upon the following tags

INFORMATIONAL - if the user has doubts or trust issues and is asking about gullak or some generic information about what to do

INCOMPLETE - if the user did not specify what he wants to know

REFERRAL - if the conversation was about referral program of gullak where user referred his friend or someone

REWARD - user is asking about some offer or reward

CALLBACK - if the user wants a callback from gullak team

COIN_DELIVERY - if the user has any query related to coin delivery

WITHDRAWAL_OR_UNLEASE - if the user is talking about unlease or money withdrawal from gullak

AUTOPAY - the user has any query related to his SIP or AUTOPAY mandate, autopay related queries are basically where user has setup a mandate or sip with gullak (either WEEKLY/MONTHLY/DAILY) and has some doubts related to that like was autopay debit successfull, why it did not debit or anything related to that

BREAK_LOCKIN - if the user wants to break the lock in for his investement, where user has invested already but the maturity is not reached but he wants to withdraw

STATEMENTS - if the user has query related to any of his investment invoice, tax reports or capital gain statements

GOLDPLUS_INTEREST - if the user has specific concerns about either the interest credited is wrong or his interest is not credited

MANUAL_PROCESS - this can be assigned if the user query involves some manual process like changing phone number

OTP - if the user some concerns related to not receiving otp for logging in the app

UNKNOWN - if not able to assign which tag should be assigned

feel free to assign multiple tags to a conversation if you feel the conversation includes multiple things

for each conversation give response in a following json like format -

{

"conversation_id": "",

"conversation_url:" "",

"status": if the conversation was escalated to another agent assign "ESCALATED" otherwise "HANDLED",

"agent_email": email of the last agent who replied to the email,

"tags": appropriate tags

}`;

export { GEMINI_FRESHCHAT_ANALYSIS_PROMPT };
