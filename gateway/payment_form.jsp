<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>

<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.TimeZone" %>
<%@ page import="java.util.UUID" %>

<%@ include file="security.jsp" %>
<html>
<head>
    <title>Signed Data Fields</title>
    <link rel="stylesheet" href="/html5storefront/style/style.css">
</head>
<body>
<%
	String endpoint = "https://testsecureacceptance.cybersource.com/silent/token/create";
  String access_key = "YOUR_CYBERSOURCE_access_key";
  String profile_id = "YOUR_CYBERSOURCE_profile_id";
%>

<form id="payment_form" action="<%= endpoint %>" method="post" role="form"
    class="form-horizontal payment-method-form-container">
<%
  request.setCharacterEncoding("UTF-8");

		HashMap params = new HashMap();
		Enumeration paramsEnum = request.getParameterNames();

		while (paramsEnum.hasMoreElements()) {
			String paramName = (String) paramsEnum.nextElement();
			String paramValue = request.getParameter(paramName);
			params.put(paramName, paramValue);
			out.print("<input type=\"hidden\" id=\"" + paramName + "\" name=\"" + paramName + "\" value=\"" + paramValue + "\"/>\n");
		}

        String pName;
        String pValue;

        pName = "transaction_uuid";
        pValue = "" + UUID.randomUUID();
        params.put(pName, pValue);
        out.print(writeInputField(pName, pValue));

        pName = "signed_date_time";
        pValue = getUTCDateTime();
        params.put(pName, pValue);
        out.print(writeInputField(pName, pValue));

        pName = "access_key";
        pValue = access_key;
        params.put(pName, pValue);
        out.print(writeInputField(pName, pValue));

        pName = "profile_id";
        pValue = profile_id;
        params.put(pName, pValue);
        out.print(writeInputField(pName, pValue));

		out.print("<input type=\"hidden\" id=\"signature\" name=\"signature\" value=\"" + sign(params) + "\"/>\n");
	%>

<%!
  private static String writeInputField(final String key, final String value) {
    return "<input type=\"hidden\" id=\"" + key + "\" name=\"" + key + "\" value=\"" + value + "\"/>";
  }
%>
	<div>
        <%-- <%
            Iterator paramsIterator = params.entrySet().iterator();
            while (paramsIterator.hasNext()) {
                Map.Entry param = (Map.Entry) paramsIterator.next();
        %>
        <div>
            <br /><span class="fieldName"><%=param.getKey()%>:</span><span class="fieldValue"><%=param.getValue()%></span>
        </div>
        <%
            }
        %> --%>
    </div>


    <div class="form-group">
        <label for="CardType" data-el-label="payment.cardType" class="control-label form-label">
            <span class="required-label">*</span>Card Type
        </label>

        <div class="form-input">
            <select id="CardType" name="card_type" class="form-control">
                <option value="001" selected>Visa</option>
                <option value="002">Master</option>
                <option value="003">American Express</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label for="CardNumber" data-el-label="payment.cardNum" class="control-label form-label">
            <span class="required-label">*</span>Credit Card Number
        </label>

        <div class="form-input">
            <input id="CardNumber" name="card_number" class="form-control" maxlength="16" type="text"/>
        </div>
    </div>

    <div class="form-group">
        <label for="ExpiryDate" data-el-label="payment.expiryDate" class="control-label form-label">
            <span class="required-label">*</span>Expiry Date
        </label>
        <div class="form-input">
            <input id="ExpiryDate" name="card_expiry_date" class="form-control" type="text"/>
        </div>
    </div>

    <div class="form-group">
    <label for="SecurityCode" data-el-label="payment.securityCode" class="control-label form-label"> <span
    class="required-label">*</span>Security Code</label>

    <div class="form-input">
    <input id="SecurityCode" name="card_cvn" class="form-control" maxlength="4" type="text"/>
    </div>
    </div>

    <div class="form-group">
    <span class="required-label">*</span><label for="Email" data-el-label="payment.email" class="control-label form-label">Email</label>

    <div class="form-input">
    <input id="Email" name="bill_to_email" class="form-control" type="text"/>
    </div>
    </div>

    <button id="submit" type="submit" class="btn btn-primary payment-save-btn" data-el-label="paymentForm.save">Submit</button>
    <button id="cancel" type="reset" class="btn payment-cancel-btn" data-el-label="paymentForm.cancel">Cancel</button>
</form>
</body>
</html>

<%!
    private String getUTCDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return sdf.format(new Date());
    }
%>
