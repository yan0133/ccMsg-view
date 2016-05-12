<?php

	$id  = $_GET['taskStatus'];
	$result = "";
	if($id==3){
		$result = '{"items":[{"companyId":"","createTime":0,"createUserId":"","taskId":"301","taskName":"我未解决的工单","taskStatus":1,"taskType":3,"ticketNum":1,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"302","taskName":"我客服组里未解决的工单","taskStatus":1,"taskType":3,"ticketNum":1,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"303","taskName":"我客服组里的新工单","taskStatus":1,"taskType":3,"ticketNum":1,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"304","taskName":"所有未解决的工单","taskStatus":1,"taskType":3,"ticketNum":4,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"305","taskName":"未分配客服的工单","taskStatus":1,"taskType":3,"ticketNum":3,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"306","taskName":"最近已解决的工单","taskStatus":1,"taskType":3,"ticketNum":2,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"307","taskName":"最近更新的工单","taskStatus":1,"taskType":3,"ticketNum":0,"usedType":3}],"retCode":"000000"}';
	}else{
		$result = '{"items":[{"companyId":"","createTime":0,"createUserId":"","taskId":"201","taskName":"大于24小时未分配客服工单","taskStatus":1,"taskType":2,"ticketNum":2,"usedType":3},{"companyId":"","createTime":0,"createUserId":"","taskId":"202","taskName":"大于48小时未解决工单","taskStatus":1,"taskType":2,"ticketNum":3,"usedType":3}],"retCode":"000000"}'
	}

	$jsonstring = json_encode($result);
	header('Content-Type: application/json'); 
	echo $jsonstring;
	
?>