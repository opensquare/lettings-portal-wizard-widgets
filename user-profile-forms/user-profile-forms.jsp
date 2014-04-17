<%@ page import="org.apache.shiro.SecurityUtils" %>
<%@ page import="org.apache.shiro.subject.Subject" %>
<%@ page import="com.osl.security.OslPrinciple" %>

<%

//Subject user = SecurityUtils.getSubject();
//OslPrinciple principle = user.getPrincipals().oneByType(OslPrinciple.class);
/* identifiers needed */ 
//String accessToken = principle.getAtttributes().get("");
String accessToken = "123456";
String userType = "landlord";
%>
<input type="hidden" name="userat" id="userat" value="<%=accessToken%>">
<input type="hidden" name="usertp" id="usertp" value="<%=userType%>">

<div class="rhinoforms-user-profile-forms-formContainer"/>