<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="locale.jsp" %>
				<div id="content_wrapper">
					<div class="row wrapper border-bottom white-bg page-heading">
		                <div class="col-lg-10">
		                    <h2>Basic Form</h2>
		                    <ol class="breadcrumb">
		                        <li>
		                            <a href="index.html">Home</a>
		                        </li>
		                        <li>
		                            <a>Forms</a>
		                        </li>
		                        <li class="active">
		                            <strong>Basic Form</strong>
		                        </li>
		                    </ol>
		                </div>
		                <div class="col-lg-2">
		
		                </div>
		            </div>
					<div class="wrapper wrapper-content animated fadeInRight">
						<div class="row">
			                <div class="col-lg-12">
			                    <div class="ibox float-e-margins">
			                        <div class="ibox-title">
			                            <h5>All form elements <small>With custom checbox and radion elements.</small></h5>
			                            <div class="ibox-tools">
			                                <a class="collapse-link">
			                                    <i class="fa fa-chevron-up"></i>
			                                </a>
			                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
			                                    <i class="fa fa-wrench"></i>
			                                </a>
			                                <ul class="dropdown-menu dropdown-user">
			                                    <li><a href="#">Config option 1</a>
			                                    </li>
			                                    <li><a href="#">Config option 2</a>
			                                    </li>
			                                </ul>
			                                <a class="close-link">
			                                    <i class="fa fa-times"></i>
			                                </a>
			                            </div>
			                        </div>
			                        <div class="ibox-content">
			                            <form method="post" id="frm_bbs_write" class="form-horizontal">
			                                <div class="form-group">
			                                	<label class="col-sm-2 control-label">$L_TITLE$</label>
			                                    <div class="col-sm-10"><input type="text" class="form-control"></div>
			                                </div>
			                                <div class="form-group">
			                                	<label class="col-sm-2 control-label">$L_CONTENT$</label>
			                                	<div class="col-sm-10">
			                                		<div class="summernote">
							                            
							                        </div>
			                                	</div>
			                                </div>
			                                <div class="form-group">
			                                	<label class="col-sm-2 control-label">$L_FILE_UPLOAD$</label>
			                                	<div class="col-sm-10">
			                                		<div class="fileinput fileinput-new input-group" data-provides="fileinput">
													    <div class="form-control" data-trigger="fileinput">
													        <i class="glyphicon glyphicon-file fileinput-exists"></i>
													    <span class="fileinput-filename"></span>
													    </div>
													    <span class="input-group-addon btn btn-default btn-file">
													        <span class="fileinput-new">Select file</span>
													        <span class="fileinput-exists">Change</span>
													        <input type="file" name="..."/>
													    </span>
													    <a href="#" class="input-group-addon btn btn-default fileinput-exists" data-dismiss="fileinput">Remove</a>
													</div> 
			                                	</div>
			                                </div>
			                                
			                                <div class="hr-line-dashed"></div>
			                                <div class="form-group">
			                                    <div class="col-sm-4 col-sm-offset-2">
			                                        <button class="btn btn-white" id="btn_cancel" type="submit">Cancel</button>
			                                        <button class="btn btn-primary" type="submit">Save changes</button>
			                                    </div>
			                                </div>
			                            </form>
			                        </div>
			                    </div>
			                </div>
			            </div>
					</div>
				</div>